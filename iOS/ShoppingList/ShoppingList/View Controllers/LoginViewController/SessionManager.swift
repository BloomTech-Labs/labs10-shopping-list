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

struct Tokens {
    let accessToken: String
    let idToken: String
}

class SessionManager {
    private static let keychainKeyAccessToken = "access_token"
    private static let keychainKeyIdToken = "id_token"

    private static let keychain = A0SimpleKeychain(service: "Auth0")
    
    static var tokens: Tokens? {
        get {
            guard let accessToken = keychain.string(forKey: keychainKeyAccessToken),
                let idToken = keychain.string(forKey: keychainKeyIdToken)
                else {
                    return nil
            }
            return Tokens(accessToken: accessToken, idToken: idToken)
        }
        set {
            if let tokens = newValue {
              keychain.setString(tokens.accessToken, forKey: keychainKeyAccessToken)
              keychain.setString(tokens.idToken, forKey: keychainKeyIdToken)
            } else {
                keychain.deleteEntry(forKey: keychainKeyAccessToken)
                keychain.deleteEntry(forKey: keychainKeyIdToken)
            }
        }
    }
    
    static func retrieveProfile(_ callback: @escaping (UserInfo?, Error?) -> ()) {
        guard let accessToken = tokens?.accessToken else {
            return callback(nil, SessionManagerError.noAccessToken)
        }
        Auth0
            .authentication()
            .userInfo(withAccessToken: accessToken)
            .start { result in
                switch(result) {
                case .success(let profile):
                    callback(profile, nil)
                case .failure(let error):
                    callback(nil, error)
                }
        }
    }
}
