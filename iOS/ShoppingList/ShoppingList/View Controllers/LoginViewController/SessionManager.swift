//
//  SessionManager.swift
//  ShoppingList
//
//  Created by Yvette Zhukovsky on 2/21/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation
import SimpleKeychain
import Auth0

var userProfile: UserInfo!

enum SessionManagerError: Error {
    case noAccessToken
}

class SessionManager {
    
    static let shared = SessionManager()
    let keychain = A0SimpleKeychain(service: "Auth0")
    
    func storeTokens(_ accessToken: String, idToken: String) {
        self.keychain.setString(accessToken, forKey: "access_token")
        self.keychain.setString(idToken, forKey: "id_token")
    }
    
    func retrieveProfile(_ callback: @escaping (Error?) -> ()) {
        guard let accessToken = self.keychain.string(forKey: "access_token") else {
            return callback(SessionManagerError.noAccessToken)
        }
        Auth0
            .authentication()
            .userInfo(withAccessToken: accessToken)
            .start { result in
                switch(result) {
                case .success(let profile):
                    userProfile = profile
                    if !isLoggedIn {
                        UI {
                            let mainVC = MainViewController.instantiate()
                            UIApplication.shared.keyWindow?.rootViewController = mainVC
                        }
                    }
                    callback(nil)
                case .failure(let error):
                    callback(error)
                }
        }
    }
    
    func logout() {
        self.keychain.clearAll()
    }
    
}
