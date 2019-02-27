//
//  ItemController.swift
//  ShoppingList
//
//  Created by Nikita Thomas on 2/14/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation
import Alamofire
import SwiftKeychainWrapper


private var baseURL = URL(string: "https://shoptrak-backend.herokuapp.com/api/")!

class SaveItem {
    
    enum ItemError: Error {
        case noIdReturned
        case backendError(String, Error)
    }
    
   static func test(){
        saveItem(
            item: Item(name: "milk", measurement: "1 lb", purchased: false ,purchasedBy: "501", category: "dairy", price: 1.5, quantity: 1, groupId: 1),
            completion: { (item, error) in
                NSLog("\(item) -- \(error?.localizedDescription)")
        }
        )
        
    }
    
     static func saveItem(item: Item, completion: @escaping (Item?, Error?) -> Void) {
        
        var item = item
        
        var url = baseURL.appendingPathComponent("item")
        var method = HTTPMethod.post
        if let id = item.id {
            url = url.appendingPathComponent(String(describing: id))
            method = .put
        }
        
        
        var json: Parameters
        do {
            json = try itemToJSON(item: item)
        }
        catch {
            completion(nil, error)
            return
        }
        
        Alamofire.request(url, method: method, parameters: json, encoding: JSONEncoding.default).validate().responseJSON { (response) in
        
            switch response.result {
            case .success(let value):
                guard let jsonDict = value as? [String: Any],
                   let itemID = jsonDict["id"] as? Int
                
                    else {
                   
                        completion(nil, ItemError.noIdReturned)
                        return
                }
                item.id = itemID
                completion(item, nil)
                
            case .failure(let error):
                completion(nil, ItemError.backendError(String(data: response.data!, encoding: .utf8 )!, error))
                return
            }
        }
    }
    
    
    
   static func itemToJSON(item: Item) throws -> Parameters {
        
        let jsonData = try! JSONEncoder().encode(item)
        return try! JSONSerialization.jsonObject(with: jsonData, options: []) as! [String: Any]
        
    }

}
