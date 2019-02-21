//
//  AccountInformationViewController.swift
//  ShoppingList
//
//  Created by Jason Modisett on 2/19/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import UIKit
import Auth0
import SwiftKeychainWrapper

class AccountInformationViewController: UIViewController {
    
    var profile: UserInfo!
    
    
    // MARK: - IBActions
    
    @IBAction func doneButtonPressed(_ sender: Any) {
        

//        Auth0
//            .authentication()
//            .userInfo(token:LoginViewController.accessToken()!)
//            .start { result in
//                switch result {
//                case .success(let profile):
//                    print(profile)
//                case .failure(let error):
//                    print("Error: \(error). Invalid accessToken. Checking refresh token.")
//                }
//        }

   // guard let profile = SessionManager.shared.profile else  {return}
     guard let profile = SessionManager.shared.profile else  {return}
        
        Auth0
            .authentication()
            .userInfo(withAccessToken: LoginViewController.accessToken()!)
            .start { result in
                switch result {
                case .success(let profile):
                    print("User Profile: \(String(describing: profile.name ))")
                    print("User Profile: \(String(describing: profile.customClaims ))")
                    print("User Profile: \(String(describing: profile.email ))")
                    print("User Profile: \(String(describing: profile.emailVerified ))")
                    print("User Profile: \(String(describing: profile.familyName ))")
                    print("User Profile: \(String(describing: profile.gender ))")
                    print("User Profile: \(String(describing: profile.givenName ))")
                    print("User Profile: \(String(describing: profile.locale ))")
                    print("User Profile: \(String(describing: profile.middleName ))")
                    print("User Profile: \(String(describing: profile.name ))")
                    print("User Profile: \(String(describing: profile.nickname ))")
                    print("User Profile: \(String(describing: profile.phoneNumber ))")
                    print("User Profile: \(String(describing: profile.phoneNumberVerified ))")
                    print("User Profile: \(String(describing: profile.picture))")
                    print("User Profile: \(String(describing: profile.preferredUsername ))")
                    print("User Profile: \(String(describing: profile.profile ))")
                    print("User Profile: \(String(describing: profile.sub ))")
                    print("User Profile: \(String(describing: profile.updatedAt ))")
                    print("User Profile: \(String(describing: profile.website ))")
                    print("User Profile: \(String(describing: profile.zoneinfo ))")
                case .failure(let error):
                    print("Failed with \(error)")
                }
        }


        
        
        dismiss(animated: true, completion: nil)
        
    }
    
}
