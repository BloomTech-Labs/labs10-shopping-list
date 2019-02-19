//
//  AboutShopTrakTableViewController.swift
//  ShoppingList
//
//  Created by Jason Modisett on 2/19/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import UIKit

class AboutShopTrakTableViewController: UITableViewController {
    
    // MARK: - IBActions
    
    @IBAction func doneButtonPressed(_ sender: Any) {
        dismiss(animated: true, completion: nil)
    }
    
    @IBAction func openAuth0(_ sender: Any) {
        let url = URL(string: "https://github.com/auth0/Auth0.swift")!
        UIApplication.shared.open(url)
    }
    
    @IBAction func openIGListKit(_ sender: Any) {
        let url = URL(string: "https://github.com/Instagram/IGListKit")!
        UIApplication.shared.open(url)
    }
    @IBAction func openPopover(_ sender: Any) {
        let url = URL(string: "https://github.com/corin8823/Popover")!
        UIApplication.shared.open(url)
    }
}
