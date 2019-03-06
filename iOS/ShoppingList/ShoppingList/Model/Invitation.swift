//
//  Invitation.swift
//  ShoppingList
//
//  Created by Yvette Zhukovsky on 3/5/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation


struct Invite: Codable {
    let id: Int
    let inviteCode: String
    let groupID: Int
    let userID: Int
    let invitee: String   //email address
    let expiration: String
    let usedBefore: Int
    let createdAt: String
    let updatedAt: String
    let groupName: String
    let userName: String
    
    
    
    
}
