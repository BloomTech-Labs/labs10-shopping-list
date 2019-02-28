//
//  ItemController.swift
//  ShoppingList
//
//  Created by Nikita Thomas on 2/14/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation
import Alamofire
import Auth0

class ItemController {
    
    private var baseURL = URL(string: "https://shoptrak-backend.herokuapp.com/api/")!

    // Loads items for the selected group
    func loadItems(completion: @escaping (Bool) -> Void = {_ in}) {
        guard let group = selectedGroup else { completion(false); return }
       guard let accessToken = SessionManager.tokens?.idToken else {return}
       
        // TODO: This is a fake URL since there is no endpoint in the api for this yet
        let url = baseURL.appendingPathComponent("item").appendingPathComponent("group").appendingPathComponent(String(group.groupID))
        var request = URLRequest(url: url)
        request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        Alamofire.request(request).validate().response { (response) in
            
            if let error = response.error {
                print(error.localizedDescription)
                completion(false)
                return
            }
            
            guard let data = response.data else {
                
                print("Error: No data when trying to load items")
                completion(false)
                return
                
            }
            
            do {
                let items = try JSONDecoder().decode([Item].self, from: data)
                let string = String(data: data, encoding: .utf8)
                print("Data String: \(string!)")
                selectedGroup?.items = items
                completion(true)
                
            } catch {
                print("Error: Could not decode data into [Item]")
                completion(false)
                return
            }
        }
    }
    
    
    func getUserID() -> Int32 {
        return Int32(123)
    }
    
    

}
