import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBNavLink,
  MDBCardFooter,
  MDBIcon,
  MDBCardTitle,
  MDBBtn
} from "mdbreact";
import { withRouter } from "react-router-dom";
import "./Styles/GroupCard.css";

const GroupCard = props => {
  return (
    <div className="group-card">
      <MDBCard className="text-center">
        <MDBCardHeader color="primary-color" tag="h3">
          {props.group.name}
        </MDBCardHeader>
        <MDBCardBody>
          <MDBCardTitle />
          <div>
            {props.group.members !== undefined
              ? props.group.members.map(usr => <p key={usr.name}>{usr.name}</p>)
              : null}
          </div>
          <MDBNavLink key={props.key} to={`/groups/${props.group.id}`}>
            <MDBBtn color="success">Enter</MDBBtn>
          </MDBNavLink>
        </MDBCardBody>
        <MDBCardFooter style={{ background: "#2A922D" }}>
          <div className="group-card-footer">
            <div
              className="group-card-footer-button"
              onClick={() =>
                props.updateGroup(props.group.id, props.group.name)
              }
            >
              <MDBIcon icon="edit" />
              Change Name
            </div>

            <div
              className="group-card-footer-button"
              onClick={() =>
                props.removeGroup(props.group.id, props.group.name)
              }
            >
              <MDBIcon icon="trash" />
              Delete Group
            </div>
          </div>
        </MDBCardFooter>
      </MDBCard>
    </div>
  );
};

export default withRouter(GroupCard);
