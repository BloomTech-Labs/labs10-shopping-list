//
//  TripController.swift
//  ShoppingList
//
//  Created by Nikita Thomas on 2/18/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation

class TripController {
    
    func newTrip(withPrice price: Double) {
        
        guard let newTrip = CoreDataManager.shared.new(Trip.self) else {
            // TODO: Error creating trip
            print("Error creating trip")
            return
        }
        
        newTrip.totalPrice = price
        newTrip.purchasedOn = Date()
        newTrip.updatedAt = Date()
        
        CoreDataManager.shared.save()
    }
    
    
    
    
    
}
