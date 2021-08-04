import { useState } from "react";
import cn from "classnames";
import { Tab } from "@headlessui/react";

function DataTabs({ data }) {
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <Tab.Group>
      <Tab.List className="flex justify-center my-3">
        <div className="border rounded-lg">
          {data.map((tab, index) => (
            <Tab
              key={index}
              className={({ selected }) =>
                cn(
                  "px-10 pt-4 pb-3 outline-none appearance-none transition first:rounded-l-lg last:rounded-r-lg border-transparent",
                  selected
                    ? "select-none text-blue-500 border-b-2 border-b-blue-400"
                    : "text-gray-800 cursor-pointer border-b-2 hover:border-b-blue-100"
                )
              }
            >
              <div className="w-8 h-8 mx-auto mb-1">{tab.icon}</div>
              <div className="">{tab.label}</div>
            </Tab>
          ))}
        </div>
      </Tab.List>
      <Tab.Panels>
        {data.map((tab, index) => (
          <Tab.Panel key={index}>
            <div className="py-12 mx-auto md:max-w-5xl">{tab.content}</div>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}

export default DataTabs;
