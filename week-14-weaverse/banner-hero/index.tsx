import {
  createSchema,
  IMAGES_PLACEHOLDERS,
  useThemeSettings,
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { backgroundInputs } from "~/components/background-image";
import { overlayInputs } from "~/components/overlay";
import type { SectionProps } from "~/components/section";
import { layoutInputs, Section } from "~/components/section";
import type { ThemeSettings } from "~/types/weaverse";

export interface BannerHeroProps extends VariantProps<typeof variants> {}

const variants = cva("flex flex-col [&_.paragraph]:mx-[unset]", {
  variants: {
    height: {
      small: "min-h-[40vh] lg:min-h-[50vh]",
      medium: "min-h-[50vh] lg:min-h-[60vh]",
      large: "min-h-[70vh] lg:min-h-[80vh]",
      full: "",
    },
    enableTransparentHeader: {
      true: "",
      false: "",
    },
    contentPosition: {
      "top left": "items-start justify-start [&_.paragraph]:text-left",
      "top center": "items-center justify-start [&_.paragraph]:text-center",
      "top right": "items-end justify-start [&_.paragraph]:text-right",
      "center left": "items-start justify-center [&_.paragraph]:text-left",
      "center center": "items-center justify-center [&_.paragraph]:text-center",
      "center right": "items-end justify-center [&_.paragraph]:text-right",
      "bottom left": "items-start justify-end [&_.paragraph]:text-left",
      "bottom center": "items-center justify-end [&_.paragraph]:text-center",
      "bottom right": "items-end justify-end [&_.paragraph]:text-right",
    },
  },
  compoundVariants: [
    {
      height: "full",
      enableTransparentHeader: true,
      className: "h-screen-no-topbar",
    },
    {
      height: "full",
      enableTransparentHeader: false,
      className: "h-screen-dynamic",
    },
  ],
  defaultVariants: {
    height: "large",
    contentPosition: "center center",
  },
});

export default function BannerHero(props: BannerHeroProps & SectionProps) {
  const { children, height, contentPosition, ...rest } = props;
  const { enableTransparentHeader } = useThemeSettings<ThemeSettings>();
  return (
    <Section
      {...rest}
      containerClassName={variants({
        contentPosition,
        height,
        enableTransparentHeader,
      })}
    >
      {children}
    </Section>
  );
}

export const schema = createSchema({
  type: "banner-hero",
  title: "Banner Hero",
  settings: [
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "height",
          label: "Section height",
          configs: {
            options: [
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
              { value: "full", label: "Fullscreen" },
            ],
          },
        },
        {
          type: "position",
          name: "contentPosition",
          label: "Content position",
          defaultValue: "center center",
        },
        ...layoutInputs.filter((inp) => inp.name !== "divider"),
      ],
    },
    {
      group: "Background",
      inputs: [
        ...backgroundInputs.filter(
          (inp) =>
            inp.name !== "backgroundFor" && inp.name !== "backgroundColor",
        ),
      ],
    },
    { group: "Overlay", inputs: overlayInputs },
    {
      group: "Promotion Badge",
      inputs: [
        {
          type: "switch",
          name: "showBadge",
          label: "Show promo badge",
          defaultValue: false,
        },
        {
          type: "text",
          name: "badgeText",
          label: "Badge text",
          defaultValue: "Sale 50%",
          condition: (data: any) => data.showBadge === true,
        },
        {
          type: "color",
          name: "badgeColor",
          label: "Badge color",
          defaultValue: "#ff0000",
          condition: (data: any) => data.showBadge === true,
        },
      ],
    },

  ],
  childTypes: ["subheading", "heading", "paragraph", "button"],
  presets: {
    height: "large",
    contentPosition: "center center",
    backgroundImage: IMAGES_PLACEHOLDERS.banner_1,
    backgroundFit: "cover",
    enableOverlay: true,
    overlayOpacity: 40,
    showBadge: false,
    children: [
      {
        type: "subheading",
        content: "Subheading",
        color: "#ffffff",
      },
      {
        type: "heading",
        content: "Banner Hero",
        as: "h2",
        color: "#ffffff",
        size: "default",
      },
      {
        type: "paragraph",
        content: "Customize this banner for your brand.",
        color: "#ffffff",
      },
    ],
  },
});