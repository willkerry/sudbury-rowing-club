import Tab from "@headlessui/react";
import PropTypes from "prop-types";

function Tabs({ data }) {
  return (
    <Tab.Group>
      <Tab.List className="flex space-x-4 border-b">
        {data.map((tab) => (
          <Tab
            key={tab.toString()}
            className="tab text-gray-700 inline-block px-0.5 py-1 m-0 cursor-pointer appearance-none outline-none select-none"
          >
            {tab.label}
          </Tab>
        ))}
      </Tab.List>

      <Tab.Panels>
        {data.map((tab) => (
          <Tab.Panel key={tab.toString()} className="my-4 prose text-gray-900">
            {tab.content}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}

Tabs.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ),
};

Tabs.defaultProps = {
  data: [],
};

export default Tabs;
