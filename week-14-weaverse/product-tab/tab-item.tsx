import { createSchema } from "@weaverse/hydrogen";

interface TabItemProps {
  tabName: string;
  collection?: {
    handle?: string;
    title?: string;
  };
}

function ProductTabItem(_props: TabItemProps) {
  return null;
}

export default ProductTabItem;

const COLLECTION_PRODUCTS_QUERY = `#graphql
  query TabCollectionProducts(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      handle
      products(first: 4) {
        nodes {
          id
          title
          handle
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const loader = async ({ data, weaverse }: any) => {
  const { storefront } = weaverse;
  const { language, country } = storefront.i18n;

  const collection = data?.collection;

  const handle =
    typeof collection === "string" ? collection : collection?.handle;

  if (!handle) {
    return {
      products: [],
    };
  }

  try {
    const result = await storefront.query(COLLECTION_PRODUCTS_QUERY, {
      variables: {
        country,
        language,
        handle,
      },
    });

    return {
      products: result?.collection?.products?.nodes || [],
    };
  } catch (error) {
    console.error("Product tab loader error:", error);

    return {
      products: [],
    };
  }
};

export const schema = createSchema({
  type: "product-tab-item",
  title: "Tab Item",
  settings: [
    {
      group: "Tab Settings",
      inputs: [
        {
          type: "text",
          name: "tabName",
          label: "Tab name",
          defaultValue: "New Tab",
        },
        {
          type: "collection",
          name: "collection",
          label: "Select collection",
          shouldRevalidate: true,
        },
      ],
    },
  ],
});