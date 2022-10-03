import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";

const SearchNews = () => {
  //   const data = await sanityClient.fetch(groq`
  //     *[_type == "news" && !(_id in path("drafts.**"))] | order(date desc){
  //         _id,
  //         "slug": slug.current,
  //         title,
  //         excerpt,
  //         date,
  //       }
  //    `);

  return (
    <Layout>
      <Container>
        <input type="text" />
      </Container>
    </Layout>
  );
};

export default SearchNews;
