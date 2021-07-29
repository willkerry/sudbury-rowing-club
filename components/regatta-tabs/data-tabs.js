import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState } from "react";
import Link from "next/link";

function DataTabs({ data }) {
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
      <TabList className="flex justify-center border-b">
        {data.map((tab, index) => (
          <Tab
            key={index}
            className="flex flex-col px-12 pt-4 pb-3 text-gray-500 cursor-pointer"
            selectedClassName="!text-white rounded-t-lg shadow-lg outline-none appearance-none select-none bg-gradient-to-tr from-blue-500 to-blue-700"
          >
            <div className="w-8 h-8 mx-auto mb-1">{tab.icon}</div>
            <div className="">{tab.label}</div>
          </Tab>
        ))}
      </TabList>

      {data.map((tab, index) => (
        <TabPanel key={index}>
          <div className="py-12 mx-auto md:max-w-5xl">{tab.content}</div>
        </TabPanel>
      ))}
    </Tabs>
  );
}

export default DataTabs;
