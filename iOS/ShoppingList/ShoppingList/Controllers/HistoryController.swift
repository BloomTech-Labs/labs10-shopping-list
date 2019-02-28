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
    
    private var baseURL = URL(string: "https://shoptrak-backend.herokuapp.com/api/")!
    
    func getHistory(completion: @escaping (Bool) -> Void = { _ in }) {
        guard let accessToken = SessionManager.tokens?.idToken else {completion(false); return}
        guard let groupID = selectedGroup?.groupID else { completion(false); return }
        
        let url = baseURL.appendingPathComponent("grouphistory").appendingPathComponent("group").appendingPathComponent(String(groupID))
        
        
        var request = URLRequest(url: url)
        
        request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        print(request)
        
        Alamofire.request(request).validate().responseData { (response) in
            switch response.result {
            case .success(let value):
                let string = String(data: value, encoding: .utf8)
                print("Data String: \(string!)")
                
                do {
                    
                    let decoder = JSONDecoder()
                    let histories = try decoder.decode(HistoryList.self, from: value)
                    
                    history = []
                    
                    for userList in histories.data {
                        for item in userList {
                            let historyItem = Item(name: item.name, purchased: true, price: item.total)
                            history.append(historyItem)
                        }
                    }
                    
                    
                    completion(true)
                    
                } catch {
                    print("Error getting groups from API response\(response)")
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
    
}
