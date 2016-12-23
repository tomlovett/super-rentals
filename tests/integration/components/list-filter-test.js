import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import RSVP from 'rsvp';

moduleForComponent('list-filter', 'Integration | Component | list filter', {
  integration: true
});

const ITEMS = [{ city: 'San Francisco'}, {city: 'Portland'}, {city: 'Seattle' }];
const FILTERED_ITEMS = [{ city: 'San Francisco' }];

test('should initially load all listings', function(assert) {
  // actions are potentially async, so we want promises
  this.on('filterByCity', (val) => {
    if (val === '') {
      return RSVP.resolve(ITEMS);
    } else {
      return RSVP.resolve(FILTERED_ITEMS);
    }
  });

  this.render(hbs`
    {{#list-filter filter=(action 'filterByCity') as |results|}}
      <ul>
        {{#each results as |item|}}
          <li class="city">
            {{item.city}}
          </li>
        {{/each}}
      </ul>
      {{/list-filter}}
  `);

  // wait function will return a promise that will execute only after all promises and xhr requests are resolved
  return wait().then(() => {
    assert.equal(this.$('.city').length, 3);
    assert.equal(this.$('.city').first().text().trim(), 'San Francisco');
  });
});

test('should update with matching listings', function(assert) {
  this.on('filterByCity', (val) => {
    if (val === '') {
      return RSVP.resolve(ITEMS);
    } else {
      return RSVP.resolve(FILTERED_ITEMS);
    }
  });

  this.render(hbs`
    {{#list-filter filter=(action 'filterByCity') as |results|}}
      <ul>
        {{#each results as |item|}}
          <li class="city">
            {{item.city}}
          </li>
        {{/each}}
      </ul>
    {{/list-filter}}
  `);

  // keyup event will trigger the search action
  this.$('.list-filter input').val('San').keyup();

  return wait().then(() => {
    assert.equal(this.$('.city').length, 1);
    assert.equal(this.$('.city').text().trim(), 'San Francisco');
  });
});
