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
    static let shared = ItemController()
    
    // MARK: - Load items
    
    // Loads items for the selected group
    func loadItems(completion: @escaping (Bool) -> Void = {_ in}) {
        
        guard let group = selectedGroup else { completion(false); return }
        guard let accessToken = SessionManager.tokens?.idToken else {return}
        
//        let url = baseURL.appendingPathComponent("item").appendingPathComponent("group").appendingPathComponent(String(group.groupID))
        let url = baseURL.appendingPathComponent("item")
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
                let itemList = try JSONDecoder().decode(ItemList.self, from: data)
                let items = itemList.data
                
                group.items = nil
                
                for item in items {
                    if item.groupID == group.groupID {
                        if group.items != nil {
                            group.items?.append(item)
                        } else {
                            group.items = [item]
                        }
                    }
                }
                
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
    
    
    func deleteItem(id: Int, completion: @escaping (Error?) -> Void) {
        guard let accessToken = SessionManager.tokens?.idToken else { return }
        let headers: HTTPHeaders = ["Authorization": "Bearer \(accessToken)"]
        let url = baseURL.appendingPathComponent("item").appendingPathComponent(String(describing: id))
        
        Alamofire.request(url, method: .delete, headers: headers).validate().responseJSON { (response) in
            switch response.result {
            case .success(_):
                completion(nil)
                return
            case .failure(let error):
                completion(ItemError.backendError(String(data: response.data!, encoding: .utf8 )!, error))
                return
            }
        }
    }
    
    func checkout(items: [Item], withTotal total: Double, completion: @escaping (Bool) -> Void) {
        
        let purchasedItems = items.map { (item) -> Item in
            item.purchased = true
            return item
        }
        
//        let purchased = items.map({ $0.purchased = true })

        let group = DispatchGroup()
        
        // Updates each item to show purchased Bool
        for i in purchasedItems {
            group.enter()
            self.saveItem(item: i) { (_, error) in
                if let _ = error {
                    completion(false)
                    group.leave()
                }
                
                group.leave()
            }
        }
        
        // Adds to groupHistory
        for i in purchasedItems {
            HistoryController().newHistory(forItem: i, withTotal: total) { (success) in
                if !success {
                    completion(false)
                    group.leave()
                }
                group.leave()
            }
        }
        
        group.notify(queue: .main) {
            print("Done")
        }
    }
    
 
    
    
    func itemToJSON(item: Item) throws -> Parameters {
        let jsonData = try! JSONEncoder().encode(item)
        return try! JSONSerialization.jsonObject(with: jsonData, options: []) as! [String: Any]
    }
    
}
