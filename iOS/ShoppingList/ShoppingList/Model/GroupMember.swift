//
//  GroupMember.swift
//  ShoppingList
//
//  Created by Nikita Thomas on 2/19/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation


struct GroupMember: Codable {
    
    var groupID: Int
    var moderator: Bool
    var monthlyNotification: Bool
    var net: Double
    var total: Double
    var userID: Int
    var weeklyNotification: Bool
}
