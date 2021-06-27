import Head from "next/head";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import DayDateFormatter from "@/components/daydate-formatter";
import Link from "next/link";
import cn from "classnames";

import ReactMarkdown from "react-markdown";
import smartypants from "@silvenon/remark-smartypants";

import regatta from "@/data/regatta.json";

export default function Regatta( ) {
  return (
    <Layout>
      <Head>
        <title>Regatta</title>
      </Head>
      <Container>
        <div>
          <div className="mx-auto space-y-3">
            <span className="font-semibold tracking-wide text-gray-700 uppercase">
              <DayDateFormatter dateString={regatta.regattaIntro.date} />
            </span>
            <h1 className="pb-6 font-serif text-4xl font-normal tracking-tight">
              {regatta.regattaIntro.title}
            </h1>
            <div className="grid grid-cols-2 gap-12">
              <div className="prose">
                <ReactMarkdown remarkPlugins={[smartypants]}>
                  {regatta.regattaIntro.description}
                </ReactMarkdown>
              </div>
              <div className="prose">
                <div className="px-8 pt-1 pb-2 text-green-900 bg-green-300 rounded-lg">
                  <h4>{regatta.regattaIntro.note.title}</h4>
                  <ReactMarkdown remarkPlugins={[smartypants]}>
                    {regatta.regattaIntro.note.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
