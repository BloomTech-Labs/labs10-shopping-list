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
import SimpleKeychain

class AccountInformationViewController: UIViewController {
    
    var profile: UserInfo!
    
    
    // MARK: - IBActions
    
    @IBAction func doneButtonPressed(_ sender: Any) {
        
        guard let profile = SessionManager.shared.profile else  {return}
        
        guard let email = profile.email else {return}
                    print(profile.name ?? " ")
                   print(profile.customClaims ?? " ")
                    print(email )
                    print(profile.emailVerified ?? " ")
                    print(profile.familyName ?? " ")
                    print( profile.gender ?? " " )
                    print(profile.givenName ?? " ")
                    print(profile.locale ?? " " )
                    print(profile.middleName  ?? " ")
                    print(profile.name ?? " ")
                    print(profile.nickname ?? " ")
                    print(profile.phoneNumber ?? " ")
                    print(profile.phoneNumberVerified ?? " ")
                    print(profile.picture ?? " ")
                    print(profile.preferredUsername ?? " ")
                    print(profile.profile ?? " " )
                    print(profile.sub )
                    print(profile.updatedAt ?? " ")
                    print(profile.website ?? " " )
                    print(profile.zoneinfo ?? " " )
                   // print(profile.email)

        
        dismiss(animated: true, completion: nil)
        
    }
    
}
