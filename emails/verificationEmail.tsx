// emails/verificationEmail.tsx
import {
  
  Container,
  Heading,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export interface VerificationEmailProps {
  email: string;
  otp: string;
}

export default function VerificationEmail({ email, otp }: VerificationEmailProps) {
  return (
    
    <Html>
      <Head>
        <title>Verify your email</title>
      </Head>
      <Preview>Verify your email</Preview>
      <Section className="bg-white py-8 px-4 sm:px-6 lg:px-8">
        <Container className="mx-auto max-w-max">
          <Heading className="text-3xl font-bold leading-tight text-gray-900">
            Verify your email
          </Heading>
          <Text className="mt-4 text-base leading-7 text-gray-600">
            To verify your email, please enter the following code:
          </Text>
          <Text className="mt-4 text-4xl font-bold leading-7 text-gray-900">
            {otp}
          </Text>
        </Container>
      </Section>
    </Html>

  );

}