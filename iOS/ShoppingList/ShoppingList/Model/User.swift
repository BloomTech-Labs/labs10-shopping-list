//
//  User.swift
//  
//
//  Created by Nikita Thomas on 2/19/19.
//

import Foundation

struct UserList: Codable {
    let profile: [User]
}

struct User: Codable {
    
    var createdAt: String
    var email: String
  //  var emailNotification: Bool
    var userID: Int?
    var name: String
  //  var role: String
    var subscriptionType: Int
  //  var textNotification: Bool
    var updatedAt: String
    var profilePicture: String
    
    var groups: [Group]?
    
    enum CodingKeys: String, CodingKey {
        case name
        case email
        case subscriptionType
        case userID = "id"
        case createdAt
        case updatedAt
        case profilePicture
    }

    
    init(email: String, name: String, profilePicture: String) {
        self.email = email
        self.name = name
        
        self.profilePicture = profilePicture
        
        self.createdAt = Date().dateToString()
        self.updatedAt = Date().dateToString()
      //  self.emailNotification = true
      //  self.textNotification = true
        
       // self.role = "Free"
        
        self.subscriptionType = 0
    }
    
    
}
