//
//  MainViewController.swift
//  Shopping List
//
//  Created by Jason Modisett on 2/14/19.
//  Copyright © 2019 Jason Modisett. All rights reserved.
//

import UIKit
import Auth0
import SwiftKeychainWrapper

class MainViewController: UIViewController, StoryboardInstantiatable {

    @IBOutlet weak var groupName: UIButton!
    static let storyboardName: StoryboardName = "MainViewController"
    
    var user: User?
    var selectedGroup: Group?
    
    // MARK: - Lifecycle methods
    
    override func viewDidLoad() {
        super.viewDidLoad()
        

        let usersCon = UserController()
        usersCon.getUser(forID: 501) { (user) in
            if let users = user {
                /*Popovers.triggerMessagePopover(with: "From restricted user list: \(users.email)" + " " + "\(users.name)" + "\n " + "\(users.profilePicture)")
               print(users)
              */
                SaveItem.test()
            }
        }
        

        let groupCon = GroupController()
        groupCon.getGroupWith(userID: 501) { (groups) in
            
            if let groups = groups {
                self.user?.groups = groups
                self.selectedGroup = groups[0]
                self.updateViews()
            }
            
            let groupMemberCon = GroupMemberController()
            groupMemberCon.getGroupMembers(forGroup: self.selectedGroup!) { (group) in
                guard let group = group else { return }
                
                print("Got a group with id: \(group.groupID) and \(group.memberAmount) members. The first member's userID is: \(String(describing: group.members?.first?.userID))")
            }
        }
        
        
        
        // Testing creating new groups
//        groupCon.newGroup(withName: "Testing1", byUserID: 502) { (group) in
//
//            if let group = group {
//                print(group)
//            }
//        }
    }
    
    
    // MARK: - IBActions
    
    @IBAction func addNewItemButtonPressed(_ sender: Any) {
        
     
        
    }
    

    
    @IBAction func settingsButtonPressed(_ sender: Any) {
        let storyboard = UIStoryboard(name: "SettingsTableViewController", bundle: nil)
        let settingsVC = storyboard.instantiateInitialViewController() ?? SettingsTableViewController.instantiate()
        present(settingsVC, animated: true, completion: nil)
        
    }
    
    
   
    
    
    
    func updateViews() {
        
        if let name = selectedGroup {
            groupName.setTitle(name.name, for: .normal)
        }
        
    }

}


