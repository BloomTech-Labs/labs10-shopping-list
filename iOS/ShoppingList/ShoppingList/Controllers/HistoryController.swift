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

 private var baseURL = URL(string: "https://shoptrak-backend.herokuapp.com/api/")!

func getHistory(forGroupID groupID: Int, completion: @escaping (Bool) -> Void = { _ in }) {
    guard let accessToken = SessionManager.tokens?.idToken else {return}
    
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
                let histories = try decoder.decode([HistoryList].self, from: value)
                
               // history = histories.data
                
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
