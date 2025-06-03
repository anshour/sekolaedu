import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface PasswordResetEmailProps {
  resetLink: string;
  userName?: string;
}

export const PasswordResetEmail = ({
  resetLink,
  userName = "User",
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Reset your password - SekolaEdu</Preview>
      <Container style={container}>
        <Section>
          <Row>
            <Column>
              <Img
                style={sectionLogo}
                src={`https://your-base-url.com/static/sekolaedu-logo.png`}
                width="155"
                height="31"
                alt="SekolaEdu"
              />
            </Column>
          </Row>
        </Section>

        <Section style={paragraphContent}>
          <Hr style={hr} />
          <Text style={heading}>PASSWORD RESET REQUEST</Text>
          <Text style={paragraph}>Hello {userName},</Text>
          <Text style={paragraph}>
            We received a request to reset the password for your SekolaEdu
            account.
          </Text>
          <Text style={paragraph}>
            Click the button below to reset your password. This link will expire
            in 1 hour for security reasons.
          </Text>
        </Section>

        <Section style={{ ...paragraphContent, textAlign: "center" }}>
          <Link href={resetLink} style={button}>
            Reset Password
          </Link>
        </Section>

        <Section style={paragraphList}>
          <Text style={paragraph}>
            If the button above doesn't work, you can copy and paste the
            following link into your browser:
          </Text>
          <Text style={linkText}>{resetLink}</Text>
        </Section>

        <Section style={paragraphContent}>
          <Text style={paragraph}>
            If you didn't request this password reset, you can safely ignore
            this email. Your password will remain unchanged.
          </Text>
          <Text style={paragraph}>
            For security reasons, this link will expire in 1 hour.
          </Text>
          <Hr style={hr} />
        </Section>

        <Section style={paragraphContent}>
          <Text style={paragraph}>Best regards,</Text>
          <Text style={{ ...paragraph, fontSize: "16px", fontWeight: "600" }}>
            The SekolaEdu Team
          </Text>
        </Section>

        <Section style={containerContact}>
          <Row>
            <Text style={paragraph}>Need help?</Text>
          </Row>
          <Row>
            <Text style={{ ...paragraph, fontSize: "12px" }}>
              Contact our support team at{" "}
              <Link href="mailto:support@sekolaedu.com" style={link}>
                support@sekolaedu.com
              </Link>
            </Text>
          </Row>
        </Section>

        <Section style={{ ...paragraphContent, paddingBottom: 30 }}>
          <Text
            style={{
              ...paragraph,
              fontSize: "12px",
              textAlign: "center",
              margin: 0,
            }}
          >
            © 2025 SekolaEdu. All rights reserved.
          </Text>
          <Text
            style={{
              ...paragraph,
              fontSize: "12px",
              textAlign: "center",
              margin: 0,
            }}
          >
            This email was sent because you requested a password reset for your
            SekolaEdu account.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default PasswordResetEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const sectionLogo = {
  padding: "0 40px",
  textAlign: "center" as const,
  paddingTop: "20px",
};

const container = {
  margin: "30px auto",
  backgroundColor: "#fff",
  borderRadius: 5,
  overflow: "hidden",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const containerContact = {
  backgroundColor: "#f8fafc",
  width: "90%",
  borderRadius: "5px",
  overflow: "hidden",
  padding: "20px",
  margin: "0 auto",
};

const heading = {
  fontSize: "16px",
  lineHeight: "26px",
  fontWeight: "700",
  color: "#1f2937",
  textAlign: "center" as const,
};

const paragraphContent = {
  padding: "0 40px",
};

const paragraphList = {
  paddingLeft: 40,
  paddingRight: 40,
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#374151",
};

const link = {
  ...paragraph,
  color: "#3b82f6",
  textDecoration: "underline",
};

const linkText = {
  ...paragraph,
  color: "#6b7280",
  fontSize: "12px",
  wordBreak: "break-all" as const,
  padding: "10px",
  backgroundColor: "#f3f4f6",
  borderRadius: "4px",
  fontFamily: "monospace",
};

const button = {
  backgroundColor: "#3b82f6",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: "600",
  display: "inline-block",
  textAlign: "center" as const,
  margin: "20px 0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};
