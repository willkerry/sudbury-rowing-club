import Head from "next/head";
import { type NextPage } from "next";
import http from "http";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import ErrorImage from "@/components/error/image";
import CallToAction404 from "@/components/error/cta-404";

type Props = {
  statusCode?: number;
};

const CustomError: NextPage<Props> = ({ statusCode }) => {
  const message = http.STATUS_CODES[statusCode || 404] || "Error";
  const title = `${statusCode} ${message}`;

  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <HeroTitle prose title={title} transparent />
      <ErrorImage />
      <Container className="mt-12 prose max-w-prose">
        {statusCode === 404 && <CallToAction404 />}
      </Container>
    </Layout>
  );
};

CustomError.getInitialProps = ({ res, err }) => {
  let statusCode = 404;
  if (res?.statusCode) {
    statusCode = res.statusCode;
  } else if (err?.statusCode) {
    statusCode = err.statusCode;
  }

  return { statusCode };
};

export default CustomError;
