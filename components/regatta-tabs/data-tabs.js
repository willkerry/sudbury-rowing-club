import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
function DataTabs({ data }) {
  return (
    <Tabs>
      <TabList className="border-b">
        {data.map((tab, index) => (
          <Tab key={index} className="px-12 py-8 text-gray-500 regatta-tab big-tab">
            {tab.label}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="py-8">
        {data.map((tab, index) => (
          <TabPanel key={index}>{tab.content}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}

export default DataTabs;
