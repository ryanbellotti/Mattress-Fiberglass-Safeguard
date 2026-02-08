import { test } from 'node:test';
import assert from 'node:assert';
import { DASHBOARD_RESOURCES } from './resources.ts';

test('DASHBOARD_RESOURCES structure', (t) => {
  assert.ok(Array.isArray(DASHBOARD_RESOURCES), 'DASHBOARD_RESOURCES should be an array');
  assert.ok(DASHBOARD_RESOURCES.length > 0, 'DASHBOARD_RESOURCES should not be empty');

  DASHBOARD_RESOURCES.forEach((category: any) => {
    assert.ok(typeof category.category === 'string', 'Category name should be a string');
    assert.ok(Array.isArray(category.links), 'Links should be an array');

    category.links.forEach((link: any) => {
      assert.ok(typeof link.label === 'string', 'Label should be a string');
      assert.ok(typeof link.url === 'string', 'URL should be a string');
      assert.ok(typeof link.sub === 'string', 'Sub should be a string');

      if (link.url !== '#') {
        try {
          new URL(link.url);
        } catch (e) {
          assert.fail(`Invalid URL: ${link.url}`);
        }
      }
    });
  });
});
