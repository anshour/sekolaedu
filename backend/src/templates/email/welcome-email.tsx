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

interface WelcomeEmailProps {
  userName: string;
  email: string;
  password: string;
  loginUrl?: string;
}

export const WelcomeEmail = ({
  userName,
  email,
  password,
  loginUrl = "/auth/login",
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Welcome to SekolaEdu - Your account is ready!</Preview>
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
          <Text style={heading}>WELCOME TO SEKOLAEDU!</Text>
          <Text style={paragraph}>Hello {userName},</Text>
          <Text style={paragraph}>
            Welcome to SekolaEdu! We're excited to have you join our educational
            platform. Your account has been successfully created and is ready to
            use.
          </Text>
          <Text style={paragraph}>
            To get started, please use the following login credentials:
          </Text>
        </Section>

        <Section style={credentialsSection}>
          <Text style={credentialsText}>
            <strong>Email:</strong>
            <span style={credentialsValue}>{email}</span>
          </Text>
          <Text style={credentialsText}>
            <strong>Password:</strong>
            <span style={credentialsValue}>{password}</span>
          </Text>
        </Section>

        <Section style={paragraphContent}>
          <Text style={paragraph}>
            For security reasons, we strongly recommend changing your password
            after your first login.
          </Text>
        </Section>

        <Section style={{ ...paragraphContent, textAlign: "center" }}>
          <Link href={loginUrl} style={button}>
            Login to SekolaEdu
          </Link>
        </Section>

        <Section style={paragraphList}>
          <Text style={paragraph}>
            If the button above doesn't work, you can copy and paste the
            following link into your browser:
          </Text>
          <Text style={linkText}>{loginUrl}</Text>
        </Section>

        <Section style={paragraphContent}>
          <Text style={paragraph}>
            If you have any questions or need assistance getting started, don't
            hesitate to reach out to our support team.
          </Text>
          <Text style={paragraph}>Best regards,</Text>
          <Text style={{ ...paragraph, fontSize: "16px", fontWeight: "600" }}>
            The SekolaEdu Team
          </Text>
        </Section>

        <Section style={containerContact}>
          <Row>
            <Text style={paragraph}>Need help getting started?</Text>
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
            This email was sent because an account was created for you on
            SekolaEdu.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

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

const credentialsSection = {
  backgroundColor: "#f8fafc",
  margin: "20px 40px",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
};

const credentialsTitle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#1f2937",
  marginBottom: "10px",
};

const credentialsText = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#374151",
  margin: "8px 0",
};

const credentialsValue = {
  padding: "2px 6px",
  borderRadius: "4px",
  fontFamily: "monospace",
  fontSize: "13px",
};

const featureTitle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#1f2937",
  marginBottom: "10px",
  marginTop: "20px",
};

const featureItem = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#374151",
  margin: "4px 0",
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
