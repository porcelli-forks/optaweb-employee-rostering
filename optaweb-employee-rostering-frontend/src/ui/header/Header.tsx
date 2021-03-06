/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Brand, PageHeader } from '@patternfly/react-core';
import * as React from 'react';
import { useMediaQuery } from 'react-responsive';
import Navigation from './Navigation';
import Toolbar from './Toolbar';

const Header: React.FC<{ onNavToggle: () => void} > = ({ onNavToggle }) => {
  const laptopOrBigger = useMediaQuery({ minWidth: 1400 });
  return (
    <PageHeader
      logo={(
        <Brand src="/assets/images/optaPlannerLogo200px.png" alt="OptaPlanner Logo" />
      )}
      logoProps={{
        href: 'https://www.optaplanner.org',
        target: '_blank',
        rel: 'noopener noreferrer',
      }}
      toolbar={<Toolbar />}
      topNav={laptopOrBigger && <Navigation variant="horizontal" />}
      showNavToggle={!laptopOrBigger}
      onNavToggle={onNavToggle}
    />
  );
};

export default Header;
