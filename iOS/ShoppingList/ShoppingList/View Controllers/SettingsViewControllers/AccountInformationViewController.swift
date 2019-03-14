//
//  AccountInformationViewController.swift
//  ShoppingList
//
//  Created by Jason Modisett on 2/19/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import UIKit
import Kingfisher

class AccountInformationViewController: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate, UITextFieldDelegate {
    
    @IBOutlet weak var profilePictureImageView: UIImageView!
    @IBOutlet weak var profileNameTextField: UITextField!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
        update()
    }
    
    private func update() {
        guard let user = userObject else { return }
        let profilePictureUrl = URL(string: user.profilePicture)!
        profilePictureImageView.kf.setImage(with: profilePictureUrl)
        profileNameTextField.text = user.name
    }
    
    private func setup() {
        profilePictureImageView.layer.cornerRadius = profilePictureImageView.frame.height / 2
        profileNameTextField.delegate = self
    }
    
    // MARK: - IBActions
    
    @IBAction func doneButtonPressed(_ sender: Any) {
        if let text = profileNameTextField.text {
            UserController.shared.changeUserNameTo(name: text) { (_) in }
            profileNameTextField.resignFirstResponder()
        }
        dismiss(animated: true, completion: nil)
    }
    
    
    @IBAction func updatePhoto(_ sender: Any) {
        showImagePicker()
    }
    
    func showImagePicker() {
        let picker = UIImagePickerController()
        picker.delegate = self
        picker.sourceType = .photoLibrary
        present(picker, animated: true, completion: nil)
    }
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        
        dismiss(animated: true, completion: nil)
        
        guard let selectedImage = info[UIImagePickerController.InfoKey.originalImage] as? UIImage else { return }
        
        profilePictureImageView.image = selectedImage
        UserController.shared.updateProfilePic(withImage: selectedImage) { (_) in }
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        guard let text = textField.text else { return false }
        UserController.shared.changeUserNameTo(name: text) { (_) in }
        profileNameTextField.resignFirstResponder()
        return true
    }
}
