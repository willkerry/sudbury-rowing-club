import Head from "next/head";
import Container from "../components/container";
import HeroTitle from "../components/hero-title";
import Layout from "../components/layout";

import { officers as items} from "../data/governance.json";

export default function Governance({ preview }) {
  return (
    <Layout preview={preview}>
      <Head>
        <title>Governance</title>
      </Head>
      <HeroTitle title="Governance" />
      <Container>
        <div className="flex">
          <div className="md:w-1/5"><h2>Club Officers</h2></div>
          <div className="grid grid-cols-4 gap-6 md:w-4/5">
            {items.map((entry) => {
              return (
                <div key={entry.name}>
                  <div className="text-xl font-bold">{entry.name}</div>
                  <div>{entry.role}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Layout>
  );
}
