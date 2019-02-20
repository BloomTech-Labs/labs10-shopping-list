//
//  Trip.swift
//  
//
//  Created by Nikita Thomas on 2/19/19.
//

import Foundation

struct Trip: Codable {
    
    var imageURL: String
    var purchasedOn: Date
    var totalPrice: Int
    var updatedAt: Date
    var userID: Int
    
    var items: [Item]
}
