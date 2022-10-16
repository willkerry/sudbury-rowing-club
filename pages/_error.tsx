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
  return (
    <Layout>
      <Head>
        <title>Error 404</title>
      </Head>
      <HeroTitle prose title={`${statusCode} ${message}`} transparent />
      <ErrorImage />
      <Container className="mt-12 prose max-w-prose">
        {statusCode === 404 && <CallToAction404 />}
      </Container>
    </Layout>
  );
};

CustomError.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default CustomError;
