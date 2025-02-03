import React from 'react';
import SupplyManagement from './SupplyManagement';

export default {
  title: 'Components/SupplyManagement',
  component: SupplyManagement,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template = () => <SupplyManagement />;

export const Default = Template.bind({});
Default.args = {};