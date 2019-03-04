//
//  GroupMember.swift
//  ShoppingList
//
//  Created by Nikita Thomas on 2/19/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation


struct GroupMember: Codable {
    
    var id: Int
    var groupID: Int
    var moderator: Bool
    var monthlyNotification: Bool
    var net: Double
    var total: Double
    var userID: Int
    var weeklyNotification: Bool
    var createdAt: String
    var updatedAt: String
    
    enum CodingKeys: String, CodingKey {
        case groupID
        case moderator
        case monthlyNotification
        case net
        case total
        case userID
        case weeklyNotification
        case createdAt
        case updatedAt
        case id
    }
}

struct GroupMemberList: Codable {
    var groupMembers: [GroupMember]
}
