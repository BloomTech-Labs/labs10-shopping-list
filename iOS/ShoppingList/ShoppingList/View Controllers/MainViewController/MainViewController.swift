//
//  MainViewController.swift
//  Shopping List
//
//  Created by Jason Modisett on 2/14/19.
//  Copyright © 2019 Jason Modisett. All rights reserved.
//

import UIKit

class MainViewController: UIViewController, StoryboardInstantiatable, GroupsPopoverViewDelegate {
    
    static let storyboardName: StoryboardName = "MainViewController"
    @IBOutlet weak var groupName: UIButton!
    
    // MARK: - Lifecycle methods
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        GroupController.shared.getGroups(forUserID: 501) { (success) in
            if allGroups.count > 0 {
                let selected = allGroups[0]
                selectedGroup = selected
                
                
                
                let usersCon = UserController()
                usersCon.getUser(forID: 501) { (user) in
                    if let users = user {
                        /*Popovers.triggerMessagePopover(with: "From restricted user list: \(users.email)" + " " + "\(users.name)" + "\n " + "\(users.profilePicture)")
                         print(users)
                         */
                        SaveItem.test()
                    }
                }
                
                GroupController.shared.getGroups(forUserID: 501, completion: { (success) in
                    
                    if success {
                        selectedGroup = allGroups[0]
                        self.updateViews()
                    }
                    
                })
            }
        }
    }
    
    private func updateViews() {
        if let name = selectedGroup {
            groupName.setTitle(name.name, for: .normal)
        }
    }
    
    func selectedGroupChanged() {
        updateViews()
    }
    
    
    // MARK: - IBActions
    
    @IBAction func addNewItemButtonPressed(_ sender: Any) {
    }
    
    @IBAction func showGroupsButtonPressed(_ sender: Any) {
        Popovers.triggerGroupsPopover(self)
    }
    
    @IBAction func settingsButtonPressed(_ sender: Any) {
        let storyboard = UIStoryboard(name: "SettingsTableViewController", bundle: nil)
        let settingsVC = storyboard.instantiateInitialViewController() ?? SettingsTableViewController.instantiate()
        present(settingsVC, animated: true, completion: nil)
    }
}




