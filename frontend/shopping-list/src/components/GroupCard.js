import React from 'react';
import {MDBCard, MDBCardBody, MDBCardText, MDBCardHeader, MDBNavLink, MDBCol} from 'mdbreact';
import {withRouter} from 'react-router-dom';

const GroupCard = props => {
    console.log('group', props.group.groupMembers)
    return(
        <div className = 'group-card'>
        <MDBNavLink key = {props.key} to={`/groups/${props.group.id}`}>
                <MDBCard style={{ width: "20rem", marginTop: "1rem", height: '15rem' }}>
                <MDBCardBody>
                    <MDBCardHeader><h2>{props.group.name}</h2></MDBCardHeader>
                    <MDBCardText>
                    {/* {props.group.groupMembers !== null || props.group.groupMembers.length > 0 ? (
                        <span> Members</span>
                    ): <div>No members</div>} */}
                    </MDBCardText>
                </MDBCardBody>
                </MDBCard>
            </MDBNavLink>
        </div>

    )
}

export default withRouter(GroupCard);