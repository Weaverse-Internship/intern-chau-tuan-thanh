import { createSchema, useParentInstance } from "@weaverse/hydrogen";
import { useState } from "react";

interface TabItemProps {
  tabName: string;
  collection?: {handle: string; title: string};
  loaderData?: {products: any[]};
}

function ProductTabItem(props: TabItemProps) {
  const { tabName, loaderData } = props;
  const [isOpen, setIsOpen] = useState(false);
  const products = loaderData?.products || [];

  return (
    <div className="collection-tab-item border-b">
      <button
        className="w-full flex justify-between items-center py-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold">{tabName}</span>
        <span>{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="text-center">
                {product.featuredImage && (
                  <img
                    src={product.featuredImage.url}
                    alt={product.title}
                    className="w-full aspect-square object-cover"
                  />
                )}
                <p className="mt-2">{product.title}</p>
              </div>
            ))
          ) : (
            <p>Chưa có sản phẩm</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductTabItem;
const COLLECTION_PRODUCTS_QUERY = `#graphql
  query TabCollectionProducts($country: CountryCode, $language: LanguageCode, $handle: String!)
  @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: 8) {
        nodes {
          id
          title
          handle
          featuredImage { url altText }
          priceRange {
            minVariantPrice { amount currencyCode }
          }
        }
      }
    }
  }
`;

export const loader = async ({data, weaverse}: any) => {
  const { language, country } = weaverse.storefront.i18n;
  const { collection } = data;

  if (!collection?.handle) {
    return { products: [] };
  }

  const result = await weaverse.storefront.query(COLLECTION_PRODUCTS_QUERY, {
    variables: { country, language, handle: collection.handle },
  });

  return { products: result.collection?.products?.nodes || [] };
};


export const schema = createSchema({
  type: "collection-tab-item",
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
        },
      ],
    },
  ],
});