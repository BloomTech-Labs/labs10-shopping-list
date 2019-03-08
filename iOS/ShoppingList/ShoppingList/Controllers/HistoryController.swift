//
//  HistoryController.swift
//  ShoppingList
//
//  Created by Yvette Zhukovsky on 2/27/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation
import Alamofire
import SwiftKeychainWrapper
import Auth0

class HistoryController {
    
    static let shared = HistoryController()
    
    private var baseURL = URL(string: "https://shoptrak-backend.herokuapp.com/api/")!
    
    func getHistory(completion: @escaping (Bool) -> Void = { _ in }) {
        guard let accessToken = SessionManager.tokens?.idToken else {completion(false); return}
        guard let groupID = selectedGroup?.groupID else { completion(false); return }
        
        let url = baseURL.appendingPathComponent("grouphistory").appendingPathComponent("group").appendingPathComponent(String(groupID))
        
        var request = URLRequest(url: url)
        
        request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        Alamofire.request(request).validate().responseData { (response) in
            switch response.result {
            case .success(let value):
                
                do {
                    
                    let decoder = JSONDecoder()
                    let histories = try decoder.decode(HistoryList.self, from: value)
                    
                    for userList in histories.data {
                        
                        for item in userList {
                            
                            if item.name != nil {
                                for (index, i) in history.enumerated() {
                                    if i.name == item.name {
                                        history.remove(at: index)
                                    }
                                }
                                history.append(item)
                            }

                        }
                    }
                
                    completion(true)
                    
                } catch {

                    print("Error getting history from API response \(error)")


                    completion(false)
                    return
                }
                
            case .failure(let error):
                print(error.localizedDescription)
                completion(false)
                return
            }
        }
    }
    
    func newHistory(forItem item: Item, withTotal total: Double, completion: @escaping (Bool) -> Void) {
        guard let accessToken = SessionManager.tokens?.idToken else {completion(false); return}
        guard let groupID = selectedGroup?.groupID else { completion(false); return }
        
        let url = baseURL.appendingPathComponent("grouphistory")
        
        var request = URLRequest(url: url)
        
        request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        let parameters: [String: Any] = ["userID": userID, "groupID": groupID, "total": total, "purchasedOn": Date().dateToString()]
        
        Alamofire.request(url, method: .post, parameters: parameters, encoding: JSONEncoding.default).validate().response { (response) in
            
            if let error = response.error {
                print(error.localizedDescription)
                completion(false)
                return
            }
            
            completion(true)
        }
        
    }

    
}
