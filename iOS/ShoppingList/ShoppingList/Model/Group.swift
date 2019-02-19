//
//  Group.swift
//  ShoppingList
//
//  Created by Nikita Thomas on 2/19/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation


struct Group: Codable {
    
    var name: String
    var groupID: Int?
    var token: String?
    var userID: Int
    
    var createdAt: Date
    var updatedAt: Date
    
    var members: [GroupMember]?
    var trips: [Trip]?
    
    
    init(name: String, userID: Int) {
        
        self.name = name

        self.userID = userID
        
        self.createdAt = Date()
        self.updatedAt = Date()

        
    }
}
