import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
function DataTabs({ data }) {
  return (
    <Tabs>
      <TabList className="flex justify-center border-b">
        {data.map((tab, index) => (
          <Tab key={index} className="flex px-12 py-8 text-gray-500 regatta-tab big-tab">
            {tab.label}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="py-8 mx-auto md:max-w-5xl">
        {data.map((tab, index) => (
          <TabPanel key={index}>{tab.content}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}

export default DataTabs;
