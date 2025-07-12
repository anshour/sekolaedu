import { randomBytes } from "crypto";
import { v6 as uuidV6 } from "uuid";
import { readFile } from "fs/promises";
import config from "~/config";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl as awsGetSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Class for handling cloud storage operations with AWS S3
 */
class CloudStorageService {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;
  private basePublicUrl: string;

  constructor() {
    this.bucketName = config.awsBucket!;
    this.region = config.awsDefaultRegion!;

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: config.awsAccessKeyId!,
        secretAccessKey: config.awsSecretAccessKey!,
      },
    });

    this.basePublicUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/`;
  }

  /**
   * Uploads a file to S3 using streaming to handle large files efficiently
   * @param filePath - Path to the file on disk
   * @param filename - Name to use for the file
   * @returns The generated filekey in S3
   */
  async upload(filePath: string, filename: string): Promise<string> {
    // Generate a unique file key
    const filekey = `${uuidV6()}/${randomBytes(16).toString(
      "hex",
    )}/${filename}`;

    // Use streaming instead of loading entire file into memory
    // const fileStream = createReadStream(filePath);

    const fileData = await readFile(filePath);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName, // Specify bucket here
        Key: filekey,
        Body: fileData,
      }),
    );

    return filekey;
  }

  /**
   * Generates a signed URL for temporary access to a file
   * @param filekey - The S3 key for the file
   * @param expiresIn - Time in seconds until URL expiration
   * @returns Signed URL string
   */
  async getSignedUrl(filekey: string, expiresIn = 3600 * 24): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: filekey,
    });
    return awsGetSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * Returns the public URL for a file in S3
   * @param filekey - The S3 key for the file
   * @returns Public URL string
   */
  getPublicUrl(filekey: string): string {
    return this.basePublicUrl + filekey;
  }
}

// Export a singleton instance
export default new CloudStorageService();
