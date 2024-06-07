const EventPage = () => (
  <>
    {/* <NextSeo
        title="Competition Calendar"
        description="This calendar shows competitions for the current season, as recorded by British Rowing."
        openGraph={{
          title: "Competition Calendar",
          description:
            "This calendar shows competitions for the current season, as recorded by British Rowing.",
          images: [{ url: makeShareImageURL("Competition Calendar 🗓️", true) }],
        }}
      /> */}

    <div className="prose mx-auto mb-12">
      <p>
        This calendar is provided as an ergonomic way for Sudbury members to
        check the dates of upcoming events and competitions. The data displayed
        here are drawn from the British Rowing{" "}
        <a href="https://www.britishrowing.org/competition-calendar/">
          competition calendar
        </a>{" "}
        and are updated twice a day.
      </p>
    </div>
  </>
);

export default EventPage;
