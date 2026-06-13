import { createSchema } from "@weaverse/hydrogen";
import type { SectionProps } from "~/components/section";
import { Section, layoutInputs } from "~/components/section";

export default function CollectionTabs(props: SectionProps) {
  const { children, ...rest } = props;
  return <Section {...rest}>{children}</Section>;
}

export const schema = createSchema({
  type: "product-tabs",
  title: "Product Tabs",
  childTypes: ["collection-tab-item"],
  settings: [
    {
      group: "Layout",
      inputs: layoutInputs,
    },
  ],
  presets: {
    children: [
      { type: "collection-tab-item", tabName: "Tab 1" },
      { type: "collection-tab-item", tabName: "Tab 2" },
    ],
  },
});