import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { queries } from '@erxes/ui/src/brands/graphql';
import React from 'react';
import { graphql } from 'react-apollo';
import { withProps } from '@erxes/ui/src/utils';
import { BrandsQueryResponse } from '@erxes/ui/src/brands/types';
import BrandFilter from '@erxes/ui/src/brands/components/BrandFilter';
import { queries as customerQueries } from '@erxes/ui-contacts/src/customers/graphql';
import { CountQueryResponse } from '@erxes/ui-contacts/src/customers/types';

type Props = {
  brandsQuery?: BrandsQueryResponse;
  customersCountQuery?: CountQueryResponse;
};

class BrandFilterContainer extends React.Component<Props> {
  render() {
    const { brandsQuery, customersCountQuery } = this.props;

    const counts = (customersCountQuery
      ? customersCountQuery.customerCounts
      : null) || { byBrand: {} };

    const updatedProps = {
      ...this.props,
      brands: (brandsQuery ? brandsQuery.brands : []) || [],
      loading: (brandsQuery && brandsQuery.loading) || false,
      counts: counts.byBrand,
      emptyText: 'Now easier to find contacts according to your brand'
    };

    return <BrandFilter {...updatedProps} />;
  }
}

type WrapperProps = {
  type: string;
  loadingMainQuery: boolean;
};

export default withProps<WrapperProps>(
  compose(
    graphql<WrapperProps, BrandsQueryResponse, {}>(gql(queries.brands), {
      name: 'brandsQuery',
      skip: ({ loadingMainQuery }) => loadingMainQuery
    }),
    graphql<WrapperProps, CountQueryResponse, { only: string }>(
      gql(customerQueries.customerCounts),
      {
        name: 'customersCountQuery',
        skip: ({ loadingMainQuery }) => loadingMainQuery,
        options: ({ type }) => ({
          variables: { type, only: 'byBrand' }
        })
      }
    )
  )(BrandFilterContainer)
);
