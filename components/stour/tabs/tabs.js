import { Tabs as ReachTabs } from "@reach/tabs";
import { TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import styles from "./tabs.module.css"

function Tabs({ data }) {
  return (
    <ReachTabs>
      <TabList className="flex space-x-4 border-b">
        {data.map((tab, index) => (
          <Tab
            key={index}
            className="tab text-gray-700 inline-block px-0.5 py-1 m-0 cursor-pointer appearance-none outline-none select-none"
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        {data.map((tab, index) => (
          <TabPanel key={index} className="my-4 prose text-gray-900">
            {tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </ReachTabs>
  );
}

export default Tabs;
