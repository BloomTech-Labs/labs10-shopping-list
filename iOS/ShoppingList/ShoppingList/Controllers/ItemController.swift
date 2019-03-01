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

enum ItemError: Error {
    case noIdReturned
    case backendError(String, Error)
}

class ItemController {
    
    private var baseURL = URL(string: "https://shoptrak-backend.herokuapp.com/api/")!
    
    
    // MARK: - Load items
    
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
    
    
    // MARK:- Save items methods
    
    func saveItem(item: Item, completion: @escaping (Item?, Error?) -> Void) {
        
        guard let accessToken = SessionManager.tokens?.idToken else { return }
        
        let headers: HTTPHeaders = ["Authorization": "Bearer \(accessToken)"]
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
        
        Alamofire.request(url, method: method, parameters: json, encoding: JSONEncoding.default, headers: headers).validate().responseJSON { (response) in
            
            switch response.result {
            case .success(let value):
                guard let jsonDict = value as? [String: Any],
                    let itemID = jsonDict["id"] as? Int else {
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
    
    func itemToJSON(item: Item) throws -> Parameters {
        let jsonData = try! JSONEncoder().encode(item)
        return try! JSONSerialization.jsonObject(with: jsonData, options: []) as! [String: Any]
    }
    
}
