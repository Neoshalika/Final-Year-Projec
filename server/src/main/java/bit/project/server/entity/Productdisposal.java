package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import java.time.LocalDate;
import javax.persistence.*;
import javax.persistence.Id;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Productdisposal{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    @Lob
    private String reason;

    private LocalDate date;

    private LocalDateTime tocreation;


    @OneToMany(mappedBy="productdisposal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Productdisposalproduct> productdisposalproductList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    public Productdisposal(Integer id){
        this.id = id;
    }

    public Productdisposal(Integer id, String code){
        this.id = id;
        this.code = code;
    }

}