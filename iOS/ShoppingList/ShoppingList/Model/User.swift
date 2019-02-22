//
//  User.swift
//  
//
//  Created by Nikita Thomas on 2/19/19.
//

import Foundation


struct User: Codable {
    
    var createdAt: Date
    var email: String
    var emailNotification: Bool
    var userID: Int?
    var name: String
    var role: String
    var subscriptionType: Int
    var textNotification: Bool
    var updatedAt: Date
    var profilePicture: String
    
    var groups: [Group]?
    
    init(email: String, name: String, profilePicture: String) {
        self.email = email
        self.name = name
        
        self.profilePicture = profilePicture
        
        self.createdAt = Date()
        self.updatedAt = Date()
        
        self.emailNotification = true
        self.textNotification = true
        
        self.role = "Free"
        
        self.subscriptionType = 0
    }
    
    
}
