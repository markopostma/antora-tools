import { expect, Locator, Page, test } from '@playwright/test';
import { DEFAULT_CONFIG } from '../src/constants';
import { Strategy } from '../src/enums';

test.describe('home page', async () => {
  let visited: Page;

  const suite = [
    {
      strategy: Strategy.File,
      description:
        'Welcome to the GraphQL Demo pages. This intro is mainly a demo of adoc elements.',
      path: '/graphql',
      headings: [
        {
          name: 'Scalar',
          items: [
            { text: 'Boolean', link: 'types/SCALAR/Boolean.html' },
            { text: 'Date', link: 'types/SCALAR/Date.html' },
            { text: 'Email', link: 'types/SCALAR/Email.html' },
            { text: 'Float', link: 'types/SCALAR/Float.html' },
            { text: 'ID', link: 'types/SCALAR/ID.html' },
            { text: 'Int', link: 'types/SCALAR/Int.html' },
            { text: 'String', link: 'types/SCALAR/String.html' },
          ],
        },
        {
          name: 'Object',
          items: [
            { text: 'Company', link: 'types/OBJECT/Company.html' },
            { text: 'Product', link: 'types/OBJECT/Product.html' },
            { text: 'User', link: 'types/OBJECT/User.html' },
          ],
        },
        {
          name: 'Input Object',
          items: [
            {
              text: 'CreateProduct',
              link: 'types/INPUT_OBJECT/CreateProduct.html',
            },
            {
              text: 'UpdateProduct',
              link: 'types/INPUT_OBJECT/UpdateProduct.html',
            },
            { text: 'UserFilter', link: 'types/INPUT_OBJECT/UserFilter.html' },
          ],
        },
        {
          name: 'Interface',
          items: [{ text: 'ContactInfo', link: 'types/INTERFACE/ContactInfo.html' }],
        },
        {
          name: 'Enum',
          items: [
            {
              text: 'MeasurementUnit',
              link: 'types/ENUM/MeasurementUnit.html',
            },
          ],
        },
        {
          name: 'Queries',
          items: [
            { text: 'entities', link: 'queries/entities.html' },
            { text: 'product', link: 'queries/product.html' },
            { text: 'products', link: 'queries/products.html' },
            { text: 'search', link: 'queries/search.html' },
            { text: 'user', link: 'queries/user.html' },
            { text: 'users', link: 'queries/users.html' },
          ],
        },
        {
          name: 'Mutations',
          items: [
            { text: 'create', link: 'mutations/create.html' },
            { text: 'delete', link: 'mutations/delete.html' },
            { text: 'update', link: 'mutations/update.html' },
          ],
        },
        {
          name: 'Subscriptions',
          items: [{ text: 'search', link: 'subscriptions/search.html' }],
        },
        {
          name: 'Directives',
          items: [
            { text: '@deprecated', link: 'directives/deprecated.html' },
            { text: '@experimental', link: 'directives/experimental.html' },
            { text: '@include', link: 'directives/include.html' },
            { text: '@oneOf', link: 'directives/oneOf.html' },
            { text: '@skip', link: 'directives/skip.html' },
            { text: '@specifiedBy', link: 'directives/specifiedBy.html' },
          ],
        },
        {
          name: 'Union',
          items: [{ text: 'Entity', link: 'types/UNION/Entity.html' }],
        },
      ],
    },
  ] as const;

  suite.forEach(({ strategy, path, headings, description }) => {
    test.describe(`with ${strategy} configuration`, () => {
      test.beforeEach(async ({ page }) => {
        visited = page;
        await visited.goto(path);
      });

      test('document <title>', async () => {
        await expect(visited).toHaveTitle(new RegExp(DEFAULT_CONFIG.title));
      });

      test('<h1>', async () => {
        await expect(visited.locator('h1')).toHaveText(DEFAULT_CONFIG.title);
      });

      if (description) {
        test('#preamble', async () => {
          await expect(visited.locator('#preamble .lead p')).toHaveText(description);
        });
      }

      test.describe('Documentation pages', () => {
        test('has x <h2>', async () => {
          await expect(visited.locator('h2')).toHaveCount(headings.length);
        });

        for (const { name, items } of headings) {
          const headingId = name.replaceAll(' ', '_').toLowerCase();
          const headingText = new RegExp(name);

          test.describe(name, () => {
            let anchorLocator: Locator;

            test.beforeEach(() => {
              anchorLocator = visited
                .locator('h2#_' + headingId)
                .locator('..')
                .locator('.ulist > ul')
                .first()
                .locator('> li');
            });

            test('<h2> heading', async () => {
              await expect(visited.locator('h2#_' + headingId)).toHaveText(headingText);
            });

            if (items?.length) {
              test('has x number of items', async () => {
                await expect(anchorLocator).toHaveCount(items.length);
              });
            }

            test.describe('<li> items', () => {
              items.forEach(({ text, link }, index) => {
                test(text, async () => {
                  const anchor = anchorLocator.locator('> p > a').nth(index);

                  await expect(anchor).toHaveText(text);
                  await expect(anchor).toHaveAttribute('href', link);
                });
              });
            });
          });
        }
      });
    });
  });
});
