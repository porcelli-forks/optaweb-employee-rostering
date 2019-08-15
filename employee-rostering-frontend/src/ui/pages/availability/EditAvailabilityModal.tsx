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
import React from 'react';
import { connect } from 'react-redux';

import { Button, InputGroup, Label, Form, Modal, ButtonVariant } from '@patternfly/react-core';
import DatePicker from 'react-datepicker';

import EmployeeAvailability from 'domain/EmployeeAvailability';
import Employee from 'domain/Employee';
import { AppState } from 'store/types';
import { employeeSelectors } from 'store/employee';

import "react-datepicker/dist/react-datepicker.css";
import TypeaheadSelectInput from 'ui/components/TypeaheadSelectInput';
import { withTranslation, WithTranslation } from 'react-i18next';

interface Props {
  tenantId: number;
  availability?: EmployeeAvailability;
  isOpen: boolean;
  employeeList: Employee[];
  onSave: (availability: EmployeeAvailability) => void;
  onDelete: (availability: EmployeeAvailability) => void;
  onClose: () => void;
}

const mapStateToProps = (state: AppState, ownProps: {
  availability?: EmployeeAvailability;
  isOpen: boolean;
  onSave: (availability: EmployeeAvailability) => void;
  onDelete: (availability: EmployeeAvailability) => void;
  onClose: () => void;
}): Props => ({
  ...ownProps,
  tenantId: state.tenantData.currentTenantId,
  employeeList: employeeSelectors.getEmployeeList(state)
}); 

interface State {
  editedValue: Partial<EmployeeAvailability>;
}

export class EditAvailabilityModal extends React.Component<Props & WithTranslation, State> {
  constructor(props: Props & WithTranslation) {
    super(props);

    this.onSave = this.onSave.bind(this);
    this.state = {
      editedValue: { ...this.props.availability }
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.availability === undefined && prevProps.availability !== undefined) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ editedValue: {
        tenantId: this.props.tenantId,
      } });
    }
    else if (this.props.availability !== undefined &&
      (this.props.availability.id !== prevState.editedValue.id || 
        this.props.availability.version !== prevState.editedValue.version)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ editedValue: this.props.availability });
    }
  }

  onSave() {
    const availability = this.state.editedValue;
    if (availability.employee !== undefined && availability.startDateTime !== undefined &&
      availability.endDateTime !== undefined && availability.state !== undefined) {
      this.props.onSave({ tenantId: this.props.tenantId, ...availability } as EmployeeAvailability);
    }
  }

  render() {
    const dateFormat = "MMMM dd, hh:mm a";
    return (
      <Modal
        title={this.props.availability? "Edit Availability" : "Create Availability"}
        onClose={this.props.onClose}
        isOpen={this.props.isOpen}
        actions={
          [
            <Button 
              aria-label="Close Modal"
              variant={ButtonVariant.tertiary}
              key={0}
              onClick={this.props.onClose}
            >
              Close
            </Button>
          ].concat(this.props.availability? [
            <Button
              aria-label="Delete"
              variant={ButtonVariant.danger}
              key={1}
              onClick={() => this.props.onDelete(this.props.availability as EmployeeAvailability)}
            >
              Delete
            </Button>
          ] : []).concat([
            <Button aria-label="Save" key={2} onClick={this.onSave}>Save</Button>
          ])
        }
        isSmall
      >
        <Form id="modal-element" onSubmit={(e) => e.preventDefault()}>
          <InputGroup>
            <Label>Availability Start</Label>
            <DatePicker
              aria-label="Availability Start"
              selected={this.state.editedValue.startDateTime}
              onChange={date => this.setState(prevState => ({
                editedValue: { ...prevState.editedValue, startDateTime: (date !== null)? date : undefined  }
              }))}
              dateFormat={dateFormat}
              showTimeSelect
            />
          </InputGroup>
          <InputGroup>
            <Label>Availability End</Label>
            <DatePicker
              aria-label="Availability End"
              selected={this.state.editedValue.endDateTime}
              onChange={date => this.setState(prevState => ({
                editedValue: { ...prevState.editedValue, endDateTime: (date !== null)? date : undefined  }
              }))}
              dateFormat={dateFormat}
              showTimeSelect
            />
          </InputGroup>
          <InputGroup>
            <Label>Employee</Label>
            <TypeaheadSelectInput
              aria-label="Employee"
              emptyText="Select an Employee..."
              defaultValue={this.props.availability? this.props.availability.employee : undefined}
              options={this.props.employeeList}
              optionToStringMap={employee => employee? employee.name : "Unassigned"}
              onChange={employee => this.setState(prevState => ({
                editedValue: { ...prevState.editedValue, employee: employee }
              }))}
            />
          </InputGroup>
          <InputGroup>
            <Label>Type</Label>
            <TypeaheadSelectInput
              aria-label="Type"
              emptyText="Select Type..."
              defaultValue={this.props.availability? this.props.availability.state : undefined}
              options={["UNAVAILABLE","DESIRED", "UNDESIRED"] as ("UNAVAILABLE"|"DESIRED"|"UNDESIRED")[]}
              optionToStringMap={state => this.props.t("EmployeeAvailabilityState." + state)}
              onChange={state => this.setState(prevState => ({
                editedValue: { ...prevState.editedValue, state: state }
              }))}
            />
          </InputGroup>
        </Form>
      </Modal>
    );
  }
}

// eslint-disable-next-line no-undef
export default connect(mapStateToProps)(withTranslation()(EditAvailabilityModal));