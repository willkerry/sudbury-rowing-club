import Tab from "@headlessui/react"

function Tabs({ data }) {
  return (
    <Tab.Group>
      <Tab.List className="flex space-x-4 border-b">
        {data.map((tab, index) => (
          <Tab
            key={index}
            className="tab text-gray-700 inline-block px-0.5 py-1 m-0 cursor-pointer appearance-none outline-none select-none"
          >
            {tab.label}
          </Tab>
        ))}
      </Tab.List>

      <Tab.Panels>
        {data.map((tab, index) => (
          <Tab.Panel key={index} className="my-4 prose text-gray-900">
            {tab.content}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}

export default Tabs;
