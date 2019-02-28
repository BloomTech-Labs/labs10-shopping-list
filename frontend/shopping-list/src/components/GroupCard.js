import React from 'react';
import {MDBCard, MDBCardBody, MDBCardTitle, MDBCol} from 'mdbreact';
import {withRouter} from 'react-router-dom';

const GroupCard = props => {
    return(
        <div className = 'group-card'>
        <MDBCol>
                <MDBCard style = {{width: "22rem"}}>
                <MDBCardBody>
                    <MDBCardTitle>{props.name}</MDBCardTitle>
                    {/* <MDBCardText>{email}</MDBCardText> */}
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </div>

    )
}

export default withRouter(GroupCard);